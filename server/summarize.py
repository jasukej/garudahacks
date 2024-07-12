from openai import OpenAI

def generate(detections):
    client = OpenAI()
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant to urban planners in Jakarta."},
        {"role": "user", "content": "Based on the data from the following sidewalks in this area, collate these sidewalk data into one report of three summarized paragraphs for each of the following sections about the area that can help city planners: Overall Sidewalk Quality, Accessibility, Improvements. Here is an example response: Based on the available detections, here is a summary of the area: \nOverall Sidewalk Quality: The sidewalks appear to be in good condition with no cracks, obstacles, or parked vehicles present. However, there is a lack of tactile paths and vendors along the sidewalks in this area.\nAccessibility: The sidewalk is uneven, and there are many street vendors and parked vehicles, making it difficult to navigate for wheelchair-bound individuals. Additionally, there are no tactile paths for visually impaired citizens.\nImprovements: To enhance accessibility and user experience, implementing tactile paths and regulating vendors would significantly improve this area. The summary should only have 4 paragraphs in total like above. Start the summary with this sentence: Based on the available detections, here is a summary of the area. Now, here are the relevant data:"}
    ]

    # Collate all detection data into one message
    detections_info = ""
    for detection in detections:
        detection_info = f"{detection['title']}: Cracks: {detection['hasCracks']}, Obstacles: {detection['hasObstacles']}, Parked Vehicles: {detection['hasParkedVehicles']}, Sidewalk: {detection['hasSidewalk']}, Tactile Path: {detection['hasTactilePath']}, Vendors: {detection['hasVendors']}\n"
        detections_info += detection_info
    
    # Add the collated detection data as a single user message
    messages.append({"role": "user", "content": detections_info})

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=280
    )
    print(response)

    summary = response.choices[0].message.content
    print(summary)
    
    return summary